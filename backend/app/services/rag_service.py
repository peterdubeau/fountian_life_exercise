from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

EMBEDDINGS = OpenAIEmbeddings()
LLM = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
VECTOR_STORE_PATH = Path("./vector_store")
VECTOR_STORE_PATH.mkdir(exist_ok=True)


def get_text_splitter() -> RecursiveCharacterTextSplitter:
    """Create and return a text splitter."""
    return RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )


async def add_documents_to_vector_store(text: str, document_id: int) -> None:
    """Add document text to the vector store."""
    text_splitter = get_text_splitter()
    chunks = text_splitter.split_text(text)

    if not chunks:
        return

    # Create FAISS vector store from chunks
    vector_store = FAISS.from_texts(chunks, EMBEDDINGS)

    # Load existing vector store if it exists
    existing_store_index = VECTOR_STORE_PATH / "faiss_index.faiss"
    if existing_store_index.exists():
        existing_store = FAISS.load_local(
            str(VECTOR_STORE_PATH),
            EMBEDDINGS,
            index_name="faiss_index",
            allow_dangerous_deserialization=True
        )
        vector_store.merge_from(existing_store)

    # Save updated vector store
    vector_store.save_local(str(VECTOR_STORE_PATH), "faiss_index")


async def remove_document_from_vector_store(document_id: int) -> None:
    """Remove a document from the vector store."""
    # Note: FAISS doesn't support direct deletion, so we'll need to rebuild
    # For a POC, we can skip this or rebuild the entire store
    # This is a limitation of FAISS - in production, use a vector DB that supports deletion
    pass


async def query_vector_store(question: str) -> str:
    """Query the vector store and return an answer."""
    vector_store_index = VECTOR_STORE_PATH / "faiss_index.faiss"
    
    if not vector_store_index.exists():
        return "No documents have been uploaded yet. Please upload documents first."

    # Load vector store
    vector_store = FAISS.load_local(
        str(VECTOR_STORE_PATH),
        EMBEDDINGS,
        index_name="faiss_index",
        allow_dangerous_deserialization=True
    )

    # Create retrieval chain using LCEL
    system_prompt = (
        "Use the following pieces of context to answer the question at the end. "
        "If you don't know the answer, just say that you don't know, don't try to make up an answer."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Context: {context}\n\nQuestion: {question}")
    ])

    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)
    
    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | LLM
        | StrOutputParser()
    )

    result = chain.invoke(question)
    return result if result else "I couldn't generate an answer."

