#!/usr/bin/env bash
set -euo pipefail
PYVER="python3.10"
ARCH="x86_64"
BASE="nba_predictor"

build () {
  NAME="$1"; shift
  rm -rf build "$NAME.zip"
  mkdir -p build/python
  pip install --disable-pip-version-check --no-cache-dir \
      --platform manylinux2014_${ARCH} --implementation cp --python-version 310 \
      --only-binary=:all: --target build/python "$@"
  # purge
  find build/python -type d \( -name tests -o -name __pycache__ -o -name '*.dist-info' \) -prune -exec rm -rf {} +
  (cd build && zip -r9X "../$NAME.zip" python >/dev/null)
  aws lambda publish-layer-version \
      --layer-name "$NAME" \
      --zip-file "fileb://$NAME.zip" \
      --compatible-runtimes "$PYVER" \
      --query LayerVersionArn --output text
}

build "${BASE}_core"     numpy==1.26.* scipy==1.15.*
build "${BASE}_pandas"   --no-deps pandas==2.* python-dateutil pytz tzdata
build "${BASE}_sklearn"  --no-deps scikit-learn==1.7.* joblib==1.* threadpoolctl
