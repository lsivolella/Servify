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
 * Converte {@code DATABASE_URL} (formato Render/Heroku: {@code postgres://...}) em propriedades
 * JDBC do Spring, quando {@code SPRING_DATASOURCE_URL} não estiver definida.
 */
public class DatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

	private static final String SPRING_DATASOURCE_URL = "spring.datasource.url";
	private static final String SPRING_DATASOURCE_USERNAME = "spring.datasource.username";
	private static final String SPRING_DATASOURCE_PASSWORD = "spring.datasource.password";

	@Override
	public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
		if (environment.getProperty(SPRING_DATASOURCE_URL) != null) {
			return;
		}

		String databaseUrl = environment.getProperty("DATABASE_URL");
		if (databaseUrl == null || databaseUrl.isBlank()) {
			return;
		}

		try {
			Map<String, Object> props = toSpringDataSourceProperties(databaseUrl.trim());
			environment.getPropertySources().addFirst(
					new MapPropertySource("renderDatabaseUrl", props));
		} catch (Exception ex) {
			throw new IllegalStateException("Não foi possível interpretar DATABASE_URL para JDBC", ex);
		}
	}

	private static Map<String, Object> toSpringDataSourceProperties(String databaseUrl) throws Exception {
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

	private static String urlDecode(String value) {
		return URLDecoder.decode(value, StandardCharsets.UTF_8);
	}

	@Override
	public int getOrder() {
		return Ordered.HIGHEST_PRECEDENCE + 10;
	}
}
