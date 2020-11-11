#!/usr/bin/env bash -e

SOURCE_DIR="$1"
PACKAGE_NAME="$2"

cd $SOURCE_DIR

go run github.com/GeertJohan/go.rice/rice embed-go

# Weird shell escaping to make sed happy about newlines.
REPLACEMENT="\/\/ +build bindata\\
\\
\/\/ Code generated by github.com\/GeertJohan\/go.rice\/rice. DO NOT EDIT.\\
\\
package $PACKAGE_NAME"

sed -i '' -e "s/package $PACKAGE_NAME/$REPLACEMENT/" ./rice-box.go
