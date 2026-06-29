package com.servify.backend.config;

record ResolvedDataSource(String jdbcUrl, String username, String password) {

	String safeLogLine() {
		String host = jdbcUrl;
		int at = jdbcUrl.indexOf("://");
		if (at >= 0) {
			host = jdbcUrl.substring(at + 3);
		}
		int slash = host.indexOf('/');
		if (slash >= 0) {
			host = host.substring(0, slash);
		}
		return "jdbc:postgresql://" + host + "/… (user=" + username + ")";
	}
}
