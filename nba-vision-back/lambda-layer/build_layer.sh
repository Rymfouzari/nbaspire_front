#!/usr/bin/env bash
set -euo pipefail
PY_VER="python3.10"
ARCH="x86_64"
LAYER_BASE="nba_predictor"

build_layer () {
  local NAME="$1"; shift
  rm -rf build "$NAME.zip"
  mkdir -p build/python
  pip install --disable-pip-version-check --no-cache-dir \
      --platform manylinux2014_${ARCH} --implementation cp --python-version 310 \
      --only-binary=:all: --target build/python "$@"
  find build/python -type d \( -name tests -o -name __pycache__ \) -exec rm -rf {} + || true
  command -v strip >/dev/null && find build/python -name '*.so' -exec strip --strip-unneeded {} + || true
  (cd build && zip -r9 "../$NAME.zip" python >/dev/null)
  aws lambda publish-layer-version \
      --layer-name "$NAME" \
      --zip-file "fileb://$NAME.zip" \
      --compatible-runtimes "$PY_VER" \
      --query LayerVersionArn --output text
}

build_layer "${LAYER_BASE}_numpy_scipy" numpy==1.* scipy==1.*
build_layer "${LAYER_BASE}_pandas"      pandas==2.*
build_layer "${LAYER_BASE}_sklearn"     --no-deps scikit-learn==1.* joblib==1.*