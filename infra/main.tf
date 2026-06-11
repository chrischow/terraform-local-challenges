variable "filename" {
  description = "The filename for the local file"
  type        = string
  default     = "foo.txt"
}

variable "content" {
  description = "The content of the local file"
  type        = string
  default     = "bar"
}

resource "local_file" "foo" {
  filename = var.filename
  content  = var.content
}

output "filename" {
  description = "The filename of the local file"
  value       = local_file.foo.filename
}

output "content" {
  description = "The content of the local file"
  value       = local_file.foo.content
}
