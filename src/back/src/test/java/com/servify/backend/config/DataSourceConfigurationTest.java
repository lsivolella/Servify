package com.servify.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class DataSourceConfigurationTest {

	@Test
	void usesDatabaseUrlInsteadOfLocalhostFallback() {
		MockEnvironment environment = new MockEnvironment();
		environment.setProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/servify");
		environment.setProperty(
				"DATABASE_URL",
				"postgresql://neondb_owner:secret@ep-example.neon.tech/neondb?sslmode=require");

		ResolvedDataSource resolved = DataSourceConfiguration.resolve(environment);

		assertEquals(
				"jdbc:postgresql://ep-example.neon.tech:5432/neondb?sslmode=require",
				resolved.jdbcUrl());
		assertEquals("neondb_owner", resolved.username());
		assertTrue(resolved.jdbcUrl().contains("neon.tech"));
	}
}
