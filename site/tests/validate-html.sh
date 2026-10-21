#!/usr/bin/env bash
# W3C Nu HTML Checker over every built page. Usage: VNU_JAVA=/path/to/java VNU_JAR=/path/to/vnu.jar site/tests/validate-html.sh dist-preview
set -u
DIR=${1:?dist dir}
JAVA=${VNU_JAVA:-java}; JAR=${VNU_JAR:-vnu.jar}
"$JAVA" -jar "$JAR" --skip-non-html --errors-only --stdout "$DIR" 2>&1
echo "exit: $?  files checked: $(find "$DIR" -name '*.html' | wc -l)"
