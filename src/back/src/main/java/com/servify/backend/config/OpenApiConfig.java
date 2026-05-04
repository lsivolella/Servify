package com.servify.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI servifyOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Servify API")
						.description("Documentação OpenAPI do backend Servify")
						.version("0.0.1"));
	}
}
