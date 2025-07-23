import sys, os, boto3, importlib, zipfile, tempfile, pathlib

def ensure_scipy():
    try:
        import scipy  # noqa: F401
        return
    except ModuleNotFoundError:
        pass

    bucket = os.environ["MODEL_S3_BUCKET"]
    key    = os.environ["SCIPY_WHEEL_KEY"]

    local = pathlib.Path("/tmp") / pathlib.Path(key).name
    if not local.exists():
        boto3.client("s3").download_file(bucket, key, str(local))

    # A .whl is just a zipfile; adding its path to sys.path is enough
    sys.path.insert(0, str(local))
    importlib.invalidate_caches()
    import scipy  # noqa: F401  ← import succeeds
