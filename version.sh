#!/bin/sh
git describe --tags --dirty --always | sed s/^v// | sed s/-g/-/
