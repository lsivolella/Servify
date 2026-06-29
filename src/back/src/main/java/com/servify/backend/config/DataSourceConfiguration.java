package com.servify.backend.config;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import com.zaxxer.hikari.HikariDataSource;

/**
 * Monta o {@link DataSource} lendo variáveis de ambiente em tempo de execução (Render/Neon),
 * sem depender da ordem de carregamento do {@code application.properties}.
 */
@Configuration(proxyBeanMethods = false)
public class DataSourceConfiguration {

	private static final Logger log = LoggerFactory.getLogger(DataSourceConfiguration.class);

	@Bean
	@Primary
	DataSource dataSource(Environment environment) {
		ResolvedDataSource resolved = resolve(environment);
		log.info("Conectando ao banco: {}", resolved.safeLogLine());

		HikariDataSource dataSource = new HikariDataSource();
		dataSource.setJdbcUrl(resolved.jdbcUrl());
		dataSource.setUsername(resolved.username());
		dataSource.setPassword(resolved.password());
		return dataSource;
	}

	static ResolvedDataSource resolve(Environment environment) {
		String springJdbcUrl = firstNonBlank(
				System.getenv("SPRING_DATASOURCE_URL"),
				environment.getProperty("spring.datasource.url"));
		if (isSet(springJdbcUrl) && !isLocalhostJdbcUrl(springJdbcUrl)) {
			return new ResolvedDataSource(
					springJdbcUrl,
					firstNonBlank(
							System.getenv("SPRING_DATASOURCE_USERNAME"),
							environment.getProperty("spring.datasource.username"),
							"postgres"),
					firstNonBlank(
							System.getenv("SPRING_DATASOURCE_PASSWORD"),
							environment.getProperty("spring.datasource.password"),
							""));
		}

		String databaseUrl = firstNonBlank(
				System.getenv("DATABASE_URL"),
				environment.getProperty("DATABASE_URL"));
		if (isSet(databaseUrl)) {
			return DatabaseUrlConverter.fromDatabaseUrl(databaseUrl);
		}

		ResolvedDataSource fromPg = DatabaseUrlConverter.fromPgVariables(environment);
		if (fromPg != null) {
			return fromPg;
		}

		if (isRenderDeployment()) {
			throw new IllegalStateException(
					"Banco não configurado no Render. Defina DATABASE_URL (postgresql://...) "
							+ "ou PGHOST + PGDATABASE + PGUSER + PGPASSWORD nas Environment Variables.");
		}

		String localUrl = environment.getProperty(
				"spring.datasource.url",
				"jdbc:postgresql://localhost:5432/servify");
		return new ResolvedDataSource(
				localUrl,
				environment.getProperty("spring.datasource.username", "postgres"),
				environment.getProperty("spring.datasource.password", "root"));
	}

	private static boolean isRenderDeployment() {
		return isSet(System.getenv("RENDER"));
	}

	private static boolean isLocalhostJdbcUrl(String jdbcUrl) {
		return jdbcUrl.contains("localhost") || jdbcUrl.contains("127.0.0.1");
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
}
