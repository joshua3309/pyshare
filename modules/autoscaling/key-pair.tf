resource "aws_key_pair" "terraform" {
  key_name   = var.key["name"]
  public_key = var.key["pub"]
}
