# This script is not executable and has to be included into the Bazel build action.

rm -f rice-box.go || true
$TOOL_RICE embed-go

REPLACEMENT="\\/\\/ +build bindata\\
\\
\\/\\/ Code generated by github.com\\/GeertJohan\\/go.rice\\/rice. DO NOT EDIT.\\
\\
package $PACKAGE_NAME"

sed -i '' -e "s/package $PACKAGE_NAME/$REPLACEMENT/" ./rice-box.go
