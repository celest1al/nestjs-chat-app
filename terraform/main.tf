terraform {
  required_providers {
    docker = {
        source = "kreuzwerker/docker"
        version = "2.22.0"
    }
  }
}

provider "docker" {
  
}

resource "docker_container" "rabbitmq" {
  name = "chatapp-rabbitmq"
  image = "rabbitmq:3-management"

  ports {
    internal = 5672
    external = 5672
  }

  ports {
    internal = 15672
    external = 15672
  }

  env = [
    "RABBITMQ_DEFAULT_USER=guest",
    "RABBITMQ_DEFAULT_PASS=guest"
  ]
}