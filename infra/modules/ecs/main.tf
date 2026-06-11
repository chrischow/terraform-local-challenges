resource "local_file" "ecs" {
  filename = "${var.environment}-ecs-${var.name}.txt"
  content  = "id: ${var.environment}-ecs-${var.name}\nrds_cluster_id: ${var.rds_cluster_id}\nvpc_id: ${var.vpc_id}"
}
