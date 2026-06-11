variable "environment" {
  description = "The environment name (staging or prod)"
  type        = string
}

variable "name" {
  description = "The name in snake-case"
  type        = string
}

variable "rds_cluster_id" {
  description = "The RDS cluster ID passed from the caller"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID passed from the caller"
  type        = string
}
