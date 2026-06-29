package com.servify.backend.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Configura o datasource a partir de variáveis de ambiente ({@code DATABASE_URL},
 * {@code PGHOST}/…). Executa após o {@code application.properties} para não ser sobrescrito.
 */
public class DatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

	private static final String SPRING_DATASOURCE_URL = "spring.datasource.url";
	private static final String SPRING_DATASOURCE_USERNAME = "spring.datasource.username";
	private static final String SPRING_DATASOURCE_PASSWORD = "spring.datasource.password";
	private static final String PROPERTY_SOURCE_NAME = "cloudDatabaseConfig";

	@Override
	public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
		if (isSet(System.getenv("SPRING_DATASOURCE_URL"))) {
			return;
		}

		Map<String, Object> props = resolveDataSourceProperties(environment);
		if (props == null || props.isEmpty()) {
			if (isRenderDeployment()) {
				throw new IllegalStateException(
						"Banco não configurado no Render. Defina DATABASE_URL "
								+ "(postgresql://...) ou PGHOST + PGDATABASE + PGUSER + PGPASSWORD "
								+ "nas Environment Variables do serviço.");
			}
			return;
		}

		environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, props));
	}

	private static Map<String, Object> resolveDataSourceProperties(ConfigurableEnvironment environment) {
		String databaseUrl = firstNonBlank(
				System.getenv("DATABASE_URL"),
				environment.getProperty("DATABASE_URL"));
		if (isSet(databaseUrl)) {
			try {
				return fromDatabaseUrl(databaseUrl.trim());
			} catch (Exception ex) {
				throw new IllegalStateException("Não foi possível interpretar DATABASE_URL para JDBC", ex);
			}
		}
		return fromPgVariables(environment);
	}

	private static Map<String, Object> fromPgVariables(ConfigurableEnvironment environment) {
		String host = firstNonBlank(System.getenv("PGHOST"), environment.getProperty("PGHOST"));
		String database = firstNonBlank(System.getenv("PGDATABASE"), environment.getProperty("PGDATABASE"));
		String user = firstNonBlank(System.getenv("PGUSER"), environment.getProperty("PGUSER"));
		String password = firstNonBlank(System.getenv("PGPASSWORD"), environment.getProperty("PGPASSWORD"));
		if (!isSet(host) || !isSet(database) || !isSet(user) || !isSet(password)) {
			return null;
		}

		String port = firstNonBlank(System.getenv("PGPORT"), environment.getProperty("PGPORT"), "5432");
		String sslmode = firstNonBlank(System.getenv("PGSSLMODE"), environment.getProperty("PGSSLMODE"), "require");

		Map<String, Object> props = new LinkedHashMap<>();
		props.put(
				SPRING_DATASOURCE_URL,
				"jdbc:postgresql://" + host + ":" + port + "/" + database + "?sslmode=" + sslmode);
		props.put(SPRING_DATASOURCE_USERNAME, user);
		props.put(SPRING_DATASOURCE_PASSWORD, password);
		return props;
	}

	static Map<String, Object> fromDatabaseUrl(String databaseUrl) throws Exception {
		String normalized = databaseUrl.replaceFirst("^postgres://", "postgresql://");
		URI uri = new URI(normalized);

		String userInfo = uri.getRawUserInfo();
		if (userInfo == null || userInfo.isBlank()) {
			throw new IllegalArgumentException("DATABASE_URL sem credenciais");
		}

		String[] credentials = userInfo.split(":", 2);
		String username = urlDecode(credentials[0]);
		String password = credentials.length > 1 ? urlDecode(credentials[1]) : "";

		int port = uri.getPort() > 0 ? uri.getPort() : 5432;
		String path = uri.getPath() == null ? "" : uri.getPath();
		if (path.startsWith("/")) {
			path = path.substring(1);
		}

		String query = uri.getRawQuery();
		String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + path;
		if (query == null || query.isBlank()) {
			jdbcUrl += "?sslmode=require";
		} else if (!query.contains("sslmode=")) {
			jdbcUrl += "?" + query + "&sslmode=require";
		} else {
			jdbcUrl += "?" + query;
		}

		Map<String, Object> props = new LinkedHashMap<>();
		props.put(SPRING_DATASOURCE_URL, jdbcUrl);
		props.put(SPRING_DATASOURCE_USERNAME, username);
		props.put(SPRING_DATASOURCE_PASSWORD, password);
		return props;
	}

	private static boolean isRenderDeployment() {
		return isSet(System.getenv("RENDER"));
	}

	private static boolean isSet(String value) {
		return value != null && !value.isBlank();
	}

	private static String firstNonBlank(String... values) {
		for (String value : values) {
			if (isSet(value)) {
				return value;
			}
		}
		return null;
	}

	private static String urlDecode(String value) {
		return URLDecoder.decode(value, StandardCharsets.UTF_8);
	}

	@Override
	public int getOrder() {
		// Depois do application.properties — senão o fallback localhost:5432 ganha.
		return Ordered.LOWEST_PRECEDENCE;
	}
}
