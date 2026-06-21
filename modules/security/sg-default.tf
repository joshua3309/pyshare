### DEFAULT - keep empty!

resource "aws_default_security_group" "default" {
  vpc_id = var.vpc_id
}