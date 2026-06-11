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

variable "files" {
  description = "A map of filenames to their content"
  type        = map(string)
  default     = {}
}

resource "local_file" "foo" {
  filename = var.filename
  content  = var.content
}

resource "local_file" "each" {
  for_each = var.files
  filename = each.key
  content  = each.value
}

output "filename" {
  description = "The filename of the local file"
  value       = local_file.foo.filename
}

output "content" {
  description = "The content of the local file"
  value       = local_file.foo.content
}
