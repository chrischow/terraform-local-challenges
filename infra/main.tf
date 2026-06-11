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

variable "file_count" {
  description = "The number of files to create using count"
  type        = number
  default     = 3
}

variable "isProduction" {
  description = "Whether this is a production environment"
  type        = bool
  default     = false
}

locals {
  environment_tag = var.isProduction ? "prod" : "dev"
}

resource "local_file" "foo" {
  filename = var.filename
  content  = "${var.content}-${local.environment_tag}"
}

resource "local_file" "each" {
  for_each = var.files
  filename = each.key
  content  = each.value
}

resource "local_file" "count" {
  count    = var.file_count
  filename = "count-file-${count.index}.txt"
  content  = "Content of file ${count.index}"
}

output "filename" {
  description = "The filename of the local file"
  value       = local_file.foo.filename
}

output "content" {
  description = "The content of the local file"
  value       = local_file.foo.content
}
