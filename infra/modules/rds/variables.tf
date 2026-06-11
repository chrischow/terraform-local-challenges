variable "environment" {
  description = "The environment name (staging or prod)"
  type        = string
}

variable "name" {
  description = "The name in snake-case"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID"
  type        = string
}
