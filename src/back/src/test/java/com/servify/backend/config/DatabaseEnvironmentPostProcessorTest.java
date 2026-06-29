package com.servify.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class DatabaseEnvironmentPostProcessorTest {

	@Test
	void overridesLocalhostDatasourceWhenDatabaseUrlIsPresent() throws Exception {
		MockEnvironment environment = new MockEnvironment();
		environment.setProperty(
				"spring.datasource.url",
				"jdbc:postgresql://localhost:5432/servify");

		Map<String, Object> props = DatabaseEnvironmentPostProcessor.fromDatabaseUrl(
				"postgresql://neondb_owner:secret@ep-example.neon.tech/neondb?sslmode=require");
		environment.getPropertySources().addFirst(
				new org.springframework.core.env.MapPropertySource("cloudDatabaseConfig", props));

		assertEquals(
				"jdbc:postgresql://ep-example.neon.tech:5432/neondb?sslmode=require",
				environment.getProperty("spring.datasource.url"));
		assertEquals("neondb_owner", environment.getProperty("spring.datasource.username"));
		assertEquals("secret", environment.getProperty("spring.datasource.password"));
		assertTrue(environment.getProperty("spring.datasource.url").contains("neon.tech"));
	}
}
