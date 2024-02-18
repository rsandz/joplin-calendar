import os
import random
import shutil
import time
from datetime import datetime

LOAD_TEST_NOTE_DIR = "load_test_notes"
SECONDS_IN_SIX_MONTHS = 15778800

def get_lorem_phrases():
    return [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
        "Duis aute irure dolor in reprehenderit in voluptate velit.",
    ]

def generate_files():
    working_dir = os.getcwd()

    if (os.path.isdir(f"{working_dir}/{LOAD_TEST_NOTE_DIR}")):
        user_verify = input(f"Directory {LOAD_TEST_NOTE_DIR} already exists. Do you want to delete it? (y/n) ")
        if (user_verify == "y"):
            shutil.rmtree(f"{working_dir}/{LOAD_TEST_NOTE_DIR}")
        else:
            print("Cannot generate notes.")
            exit(1)

    os.mkdir(f"{working_dir}/{LOAD_TEST_NOTE_DIR}")

    number_of_notes_to_generate = input("How many notes do you want to generate? ")

    if not number_of_notes_to_generate.isnumeric():
        print("Invalid input. Please enter a number.")
        exit(1)

    templateString = ""
    with open(f"{working_dir}/template.txt", "r") as template:
        templateString = template.read()

    for i in range(0, int(number_of_notes_to_generate)):
        with open(f"{working_dir}/{LOAD_TEST_NOTE_DIR}/{i}.md", "w") as f:
            created_time = time.time() + random.randint(-SECONDS_IN_SIX_MONTHS, SECONDS_IN_SIX_MONTHS)
            updated_time = created_time + random.randint(-SECONDS_IN_SIX_MONTHS, SECONDS_IN_SIX_MONTHS)
            noteString = templateString.replace("{title}", f"Note {i}") \
                .replace("{created}", f"{datetime.fromtimestamp(created_time).isoformat()}") \
                .replace("{updated}", f"{datetime.fromtimestamp(updated_time).isoformat()}") \
            
            noteString += random.choice(get_lorem_phrases())

            f.write(noteString)

    print(f"Successfully generated {number_of_notes_to_generate} notes.")


if __name__ == "__main__":
    generate_files()