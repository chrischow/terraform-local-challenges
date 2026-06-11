output "ecs_id" {
  description = "The ECS ID"
  value       = "${var.environment}-ecs-${var.name}"
}
