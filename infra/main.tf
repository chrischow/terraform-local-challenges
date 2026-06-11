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
