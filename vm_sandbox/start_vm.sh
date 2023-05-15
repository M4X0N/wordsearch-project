#! /bin/bash

qemu-system-x86_64 -enable-kvm -m 1G -cpu host -smp 1 \
    -usb -device usb-tablet -drive file=sandbox.raw,format=raw \
    -nic user,hostfwd=tcp::60022-:22 \
    -nic user,hostfwd=tcp::60080-:80 \
    -nic user,hostfwd=tcp::60443-:443 \
    -nic user,hostfwd=tcp::60990-:9090 \
    -nographic
