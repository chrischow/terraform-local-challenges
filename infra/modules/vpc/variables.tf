variable "environment" {
  description = "The environment name (staging or prod)"
  type        = string
}

variable "name" {
  description = "The name in snake-case"
  type        = string
}

variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
}
