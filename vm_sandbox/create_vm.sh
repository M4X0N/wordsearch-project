#! /bin/bash

qemu-img create -f raw sandbox.raw 20G
qemu-system-x86_64 -m 2G -accel kvm -cpu host -smp 1 -cdrom $1 -boot order=d -drive file=sandbox.raw,format=raw -usb -device usb-tablet


