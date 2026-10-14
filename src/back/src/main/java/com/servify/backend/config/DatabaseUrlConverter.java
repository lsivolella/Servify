package com.servify.backend.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.core.env.Environment;

final class DatabaseUrlConverter {

	private DatabaseUrlConverter() {
	}

	static ResolvedDataSource fromDatabaseUrl(String databaseUrl) {
		try {
			String normalized = databaseUrl.trim().replaceFirst("^postgres://", "postgresql://");
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

			return new ResolvedDataSource(jdbcUrl, username, password);
		} catch (RuntimeException ex) {
			throw ex;
		} catch (Exception ex) {
			throw new IllegalStateException("Não foi possível interpretar DATABASE_URL para JDBC", ex);
		}
	}

	static ResolvedDataSource fromPgVariables(Environment environment) {
		String host = firstNonBlank(System.getenv("PGHOST"), environment.getProperty("PGHOST"));
		String database = firstNonBlank(System.getenv("PGDATABASE"), environment.getProperty("PGDATABASE"));
		String user = firstNonBlank(System.getenv("PGUSER"), environment.getProperty("PGUSER"));
		String password = firstNonBlank(System.getenv("PGPASSWORD"), environment.getProperty("PGPASSWORD"));
		if (!isSet(host) || !isSet(database) || !isSet(user) || !isSet(password)) {
			return null;
		}

		String port = firstNonBlank(System.getenv("PGPORT"), environment.getProperty("PGPORT"), "5432");
		String sslmode = firstNonBlank(System.getenv("PGSSLMODE"), environment.getProperty("PGSSLMODE"), "require");
		String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database + "?sslmode=" + sslmode;
		return new ResolvedDataSource(jdbcUrl, user, password);
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
}
