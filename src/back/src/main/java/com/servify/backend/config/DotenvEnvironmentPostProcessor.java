package com.servify.backend.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Carrega {@code .env} do diretório de trabalho (ex.: {@code src/back/.env}) em desenvolvimento.
 * Variáveis já definidas no SO (como no Render) não são sobrescritas.
 */
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

	private static final String PROPERTY_SOURCE_NAME = "dotenv";

	@Override
	public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
		Path dotenv = Path.of(System.getProperty("user.dir", ".")).resolve(".env");
		if (!Files.isRegularFile(dotenv)) {
			return;
		}

		try {
			Map<String, Object> fromFile = parseDotenv(Files.readAllLines(dotenv, StandardCharsets.UTF_8));
			Map<String, Object> toApply = new LinkedHashMap<>();
			for (Map.Entry<String, Object> entry : fromFile.entrySet()) {
				String key = entry.getKey();
				if (System.getenv(key) == null) {
					toApply.put(key, entry.getValue());
				}
			}
			if (toApply.isEmpty()) {
				return;
			}

			if (environment.getPropertySources().contains(PROPERTY_SOURCE_NAME)) {
				environment.getPropertySources().replace(
						PROPERTY_SOURCE_NAME, new MapPropertySource(PROPERTY_SOURCE_NAME, toApply));
			} else {
				environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, toApply));
			}
		} catch (IOException ex) {
			throw new IllegalStateException("Falha ao ler " + dotenv.toAbsolutePath(), ex);
		}
	}

	static Map<String, Object> parseDotenv(List<String> lines) {
		Map<String, Object> result = new LinkedHashMap<>();
		for (String rawLine : lines) {
			String line = rawLine.trim();
			if (line.isEmpty() || line.startsWith("#")) {
				continue;
			}
			if (line.startsWith("export ")) {
				line = line.substring("export ".length()).trim();
			}
			int eq = line.indexOf('=');
			if (eq <= 0) {
				continue;
			}
			String key = line.substring(0, eq).trim();
			String value = unquote(line.substring(eq + 1).trim());
			result.put(key, value);
		}
		return result;
	}

	private static String unquote(String value) {
		if (value.length() >= 2) {
			char first = value.charAt(0);
			char last = value.charAt(value.length() - 1);
			if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
				return value.substring(1, value.length() - 1);
			}
		}
		return value;
	}

	@Override
	public int getOrder() {
		// Depois do application.properties; antes do DatabaseEnvironmentPostProcessor.
		return Ordered.LOWEST_PRECEDENCE - 1;
	}
}
