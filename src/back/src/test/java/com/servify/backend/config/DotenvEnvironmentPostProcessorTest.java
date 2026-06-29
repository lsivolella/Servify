package com.servify.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

class DotenvEnvironmentPostProcessorTest {

	@Test
	void parseDotenvIgnoresCommentsAndExportPrefix() {
		Map<String, Object> parsed = DotenvEnvironmentPostProcessor.parseDotenv(List.of(
				"# comentário",
				"",
				"export DATABASE_URL=postgresql://user:pass@host/db?sslmode=require",
				"JWT_SECRET=\"abc-123\"",
				"FRONTEND_BASE_URL='http://localhost:5173'"));

		assertEquals("postgresql://user:pass@host/db?sslmode=require", parsed.get("DATABASE_URL"));
		assertEquals("abc-123", parsed.get("JWT_SECRET"));
		assertEquals("http://localhost:5173", parsed.get("FRONTEND_BASE_URL"));
		assertTrue(parsed.containsKey("DATABASE_URL"));
	}
}
