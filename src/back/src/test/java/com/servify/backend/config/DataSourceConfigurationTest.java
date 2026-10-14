package com.servify.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class DataSourceConfigurationTest {

	@Test
	void usesPgVariablesInsteadOfLocalhostFallback() {
		MockEnvironment environment = new MockEnvironment();
		environment.setProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/servify");
		environment.setProperty("PGHOST", "ep-example.neon.tech");
		environment.setProperty("PGDATABASE", "neondb");
		environment.setProperty("PGUSER", "neondb_owner");
		environment.setProperty("PGPASSWORD", "secret");
		environment.setProperty("PGSSLMODE", "require");

		ResolvedDataSource resolved = DataSourceConfiguration.resolve(environment);

		assertEquals(
				"jdbc:postgresql://ep-example.neon.tech:5432/neondb?sslmode=require",
				resolved.jdbcUrl());
		assertEquals("neondb_owner", resolved.username());
		assertEquals("secret", resolved.password());
	}
}
