# Motivation
When I first picked up Terraform/Terragrunt, I had to grapple with both the IaC code **and** cloud at the same time. I think the learning experience could have been much better if these were decoupled.


### Fear
I did not have much knowledge of cloud at the time, but had to provision resources on AWS that cost money. As such, I was overly cautious, and checked every parameter for every resource I provisioned. I held my breath everytime I ran `terraform apply`.

### Sidetracking
I also sidetracked frequently to understand parameters for services like EC2 and ALB while running through the training material ([Yevgeniy Bikman's Terraform Up & Running](https://www.terraformupandrunning.com/)). This was to make sure I knew what I was provisioning, and also to figure out if those were Terraform things or AWS things.

## A Solution
I wished there a way to decouple the learning of Terraform/Terragrunt from the learning of cloud.

This repo is my attempt to make it easier for my teams to learn.