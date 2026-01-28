resource "aws_security_group" "app_sg" {
  name        = "app-sg"
  description = "Allow SSH, frontend and backend access"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend"
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "iprs_key" {
  key_name   = "iprs-ec2-key"
  public_key = file("/Users/thamindubandara/.ssh/iprs-ec2-key.pub")

}


resource "aws_instance" "app_ec2" {
  ami           = "ami-0f5ee92e2d63afc18"
  instance_type = "t3.micro"

  key_name               = aws_key_pair.iprs_key.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

    user_data = <<-EOF
              #!/bin/bash
              mkdir -p /home/ec2-user/.ssh
              echo "$(cat /home/ec2-user/.ssh/authorized_keys)" >> /home/ec2-user/.ssh/authorized_keys
              chown -R ec2-user:ec2-user /home/ec2-user/.ssh
              chmod 700 /home/ec2-user/.ssh
              chmod 600 /home/ec2-user/.ssh/authorized_keys
              EOF

  tags = {
    Name = "iprs-ec2"
  }
}

