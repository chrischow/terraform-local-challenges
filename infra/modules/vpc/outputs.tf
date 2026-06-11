output "vpc_id" {
  description = "The VPC ID"
  value       = "${var.environment}-vpc-${var.name}"
}

output "cidr_block" {
  description = "The CIDR block"
  value       = var.cidr_block
}
