import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


# Download required NLTK resources
try:
    stopwords.words("english")
except LookupError:
    print("NLTK stopwords data not found")

try:
    nltk.data.find("corpora/wordnet")
except LookupError:
    print("NLTK wordnet data not found")

# Initialize NLP tools
STOP_WORDS = set(stopwords.words("english"))
LEMMATIZER = WordNetLemmatizer()


def clean_text(text):
    """
    Cleans resume text for NLP processing.
    """

    # Convert to string
    text = str(text)

    # Convert to lowercase
    text = text.lower()

    # Remove special characters and numbers
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    # Tokenize
    words = text.split()

    # Remove stopwords and lemmatize
    cleaned_words = []

    for word in words:
        if word not in STOP_WORDS:
            word = LEMMATIZER.lemmatize(word)
            cleaned_words.append(word)

    return " ".join(cleaned_words)


def extract_words(text):
    """
    Converts cleaned text into a list of words.
    """

    cleaned_text = clean_text(text)

    return cleaned_text.split()


if __name__ == "__main__":

    sample_resume = """
    Education: Bachelor's in Computer Science
    Experience: 2 years
    Skills: Python, Java, SQL, React, Machine Learning
    """

    print("Original Text:")
    print(sample_resume)

    print("\nCleaned Text:")
    print(clean_text(sample_resume))

    print("\nExtracted Words:")
    print(extract_words(sample_resume))