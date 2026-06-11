resource "local_file" "vpc" {
  filename = "${var.environment}-vpc-${var.name}.txt"
  content  = "id: ${var.environment}-vpc-${var.name}\ncidr_block: ${var.cidr_block}"
}
