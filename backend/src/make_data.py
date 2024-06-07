import requests
import zipfile
import os


def download_file(url: str, save_as: str) -> None:
    """
    Download a file from a URL and save it to the specified location.

    Parameters:
    url (str): The URL of the file to download.
    save_as (str): The file path to save the downloaded file.
    """
    response = requests.get(url)
    with open(save_as, "wb") as writer:
        writer.write(response.content)


def unzip_file(zip_file: str, extract_dir: str) -> None:
    """
    Unzip a zip file to the specified directory.

    Parameters:
    zip_file (str): The path to the zip file.
    extract_dir (str): The directory to extract the contents of the zip file.
    """
    with zipfile.ZipFile(zip_file, "r") as zip_ref:
        zip_ref.extractall(extract_dir)


def download_and_unzip(url: str, zip_file: str, extract_dir: str) -> None:
    """
    Download a zip file from a URL and extract its contents to the specified directory.

    Parameters:
    url (str): The URL of the zip file to download.
    zip_file (str): The file path to save the downloaded zip file.
    extract_dir (str): The directory to extract the contents of the zip file.
    """
    download_file(url, zip_file)
    unzip_file(zip_file, extract_dir)
    os.remove(zip_file)


if __name__ == "__main__":
    url = "http://mlg.ucd.ie/files/datasets/bbc-fulltext.zip"
    zip_file = "bbc-fulltext.zip"
    extract_dir = "."
    download_and_unzip(url, zip_file, extract_dir)
