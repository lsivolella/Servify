# Build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests -B

# Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S servify && adduser -S servify -G servify
USER servify

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "java -jar app.jar"]
