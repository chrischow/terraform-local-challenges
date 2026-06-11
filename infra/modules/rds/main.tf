resource "local_file" "rds" {
  filename = "${var.environment}-rds-cluster-${var.name}.txt"
  content  = "id: ${var.environment}-rds-cluster-${var.name}\nvpc_id: ${var.vpc_id}"
}
