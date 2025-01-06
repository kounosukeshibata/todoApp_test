# build the app.
FROM openjdk:17-jdk-slim as build-env

# set the working dir.
WORKDIR /app

# install build tools and libraries.
RUN apt-get update && apt-get install -y maven

# copy source code to the working dir.
COPY . .

# build the app.
RUN mvn clean package

# set up the container.
FROM debian:12-slim

# set the working dir.
WORKDIR /app

# install the openjdk-17-jre-headless and clean up unnecessary files.
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-17-jre-headless && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# set environment variables.
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64/jre
ENV PATH=$PATH:$JAVA_HOME/bin

# copy the built app from the build-env.
COPY --from=build-env /app/target/*.jar app.jar

# expose the port.
EXPOSE 8080

# command to run the app using java.
ENTRYPOINT ["java","-jar","app.jar"]

