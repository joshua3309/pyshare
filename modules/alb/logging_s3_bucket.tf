resource "aws_s3_bucket" "logs" {
  count = var.logs_bucket == null ? 0 : 1

  bucket = var.logs_bucket

  tags = local.common_tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  count  = var.logs_bucket == null ? 0 : 1
  bucket = aws_s3_bucket.logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  count  = var.logs_bucket == null ? 0 : 1
  bucket = aws_s3_bucket.logs[0].id

  rule {
    id     = "delete-old-logs"
    status = "Enabled"

    expiration {
      days = var.logs_expiration
    }

    filter {
      prefix = ""
    }
  }
}

resource "aws_s3_bucket_policy" "alb_logs" {
  count  = var.logs_bucket == null ? 0 : 1
  bucket = aws_s3_bucket.logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "ALBLogDeliveryWrite"
        Effect = "Allow"

        Principal = {
          Service = [
            "delivery.logs.amazonaws.com",
            "logdelivery.elasticloadbalancing.amazonaws.com"
          ]
        }

        Action = "s3:PutObject"

        Resource = "${aws_s3_bucket.logs[0].arn}/${var.logs_prefix}/AWSLogs/${var.account_id}/*"

        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },

      {
        Sid    = "ALBLogDeliveryAclCheck"
        Effect = "Allow"

        Principal = {
          Service = [
            "delivery.logs.amazonaws.com",
            "logdelivery.elasticloadbalancing.amazonaws.com"
          ]          
        }

        Action = "s3:GetBucketAcl"

        Resource = aws_s3_bucket.logs[0].arn
      }
    ]
  })
}