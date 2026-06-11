output "rds_cluster_id" {
  description = "The RDS cluster ID"
  value       = "${var.environment}-rds-cluster-${var.name}"
}
