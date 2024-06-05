import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import styled from "styled-components";
import { Header } from "../header";
import image from '/image.svg';

const Container = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 171px);
`;

const UploadInput = styled.input`
    display: none;
`;

const DropArea = styled.div`
    border: 2px dashed #a7ce2e;
    border-radius: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const UploadLabel = styled.label`
    width: 100%;
    color: #a7ce2e;
    padding: 64px;
    text-align: center;
    cursor: pointer;
`;

const SelectedFilesContainer = styled.div`
    display: flex;
    gap: 16px;
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;

    img {
        width: 50px;
    }

    div {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .selected-file-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        button {
            background: none;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
    }
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoadingIndicator = styled.div`
    border: 4px solid #ccc;
    border-top: 4px solid #a7ce2e;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
`;

const Form = styled.form`
    max-width: 1024px;
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #a7ce2e;
    }
`;

const FormTextArea = styled.textarea`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    resize: none;

    &:focus {
        outline: none;
        border-color: #a7ce2e;
    }
`;

const FormButton = styled.button`
    background-color: #a7ce2e;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
`;

const CepContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CepInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #a7ce2e;
    }
`;


export const Report = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [whatsapp, setWhatsapp] = useState("")
    const [comments, setComments] = useState("")
    const [cepInput, setCepInput] = useState("");
    const [existingAddress, setExistingAddress] = useState(false)
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [street, setStreet] = useState("")
    const [streetNumber, setStreetNumber] = useState("")
    const [neighborhood, setNeighborhood] = useState("")

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const coords = position.coords
            setLatitude(coords.latitude)
            setLongitude(coords.longitude)
        })
    }, [])

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        uploadFiles(e.dataTransfer.files);
    };

    const handleFileSelect = (e) => {
        uploadFiles(e.target.files);
    };

    const handleWhatsApp = (event) => {
        const inputMobilePhone = event.target.value
        const formattedPhone = inputMobilePhone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        setWhatsapp(formattedPhone)
    };

    const handleCepInputChange = (e) => {
        setCepInput(e.target.value);
        fetchAddressInfo(e.target.value);
    };

    const fetchAddressInfo = async (cep) => {
        try {
            if (cep.length >= 8) {
                const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
                if (!response.ok) throw new Error("Erro ao buscar informações do endereço")
                const data = await response.json()
                const { city, state, street, neighborhood } = data
                setCity(city)
                setState(state)
                setStreet(street)
                setNeighborhood(neighborhood)
                setExistingAddress(true)
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const uploadFiles = async (selectedFiles) => {
        setLoading(true);
        const responseUpload = await Promise.all(
            Array.from(selectedFiles).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch('http://localhost:8080/upload_file', {
                    method: 'POST',
                    body: formData
                });
                if (!response.ok) {
                    throw new Error('Erro ao fazer upload');
                }
                const { id, path } = await response.json();
                return {
                    id,
                    path,
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            })
        );
        setFiles(responseUpload)
        setLoading(false);
    };

    const makeReport = async () => {
        const report = {
            "mobilePhone": whatsapp,
            "latitude": latitude,
            "longitude": longitude,
            "city": city,
            "state": state,
            "zipCode": cepInput,
            "street": street,
            "streetNumber": streetNumber,
            "neighborhood": neighborhood,
            "comments": comments,
            "images": files.map(file => (file.path)),
        }
        const response = await fetch('http://localhost:8080/make_report', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(report)
        })
        if (response.status != 201) return toast.error('Erro ao enviar denúncia')
        toast.info('Denúncia enviado com sucesso!')
    }

    const removeFile = async (id) => {
        const response = await fetch(`http://localhost:8080/remove_file/${id}`, {
            method: 'POST'
        })
        if (response.status != 204) alert('Erro ao remover arquivo')
        const newFiles = files.filter(file => file.id != id)
        setFiles([...newFiles])
    }

    return (
        <>
            <Header />
            <Container>
                <h2>Nova denúncia</h2>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <DropArea onDragOver={handleDragOver} onDrop={handleDrop}>
                        <UploadLabel htmlFor="fileUpload">Arraste e solte arquivos aqui ou clique para selecionar</UploadLabel>
                        <UploadInput
                            id="fileUpload"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                        />
                    </DropArea>
                    {loading && (
                        <LoadingOverlay>
                            <LoadingIndicator />
                        </LoadingOverlay>
                    )}
                    {files.length > 0 && (
                        <>
                            <h3>Arquivos selecionados</h3>
                            {files.map((file, index) => (
                                <SelectedFilesContainer>
                                    <img src={image} />
                                    <div>
                                        <div className="selected-file-header">
                                            <span>{file.name}</span>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                            >X</button>
                                        </div>
                                        {/* <p>Path: {file.path}</p> */}
                                        <p>{new Intl.NumberFormat('pt-BR', {
                                            style: 'unit',
                                            unit: 'kilobyte'
                                        }).format(file.size)}</p>
                                    </div>
                                </SelectedFilesContainer>
                            ))}
                        </>
                    )}
                    <CepContainer>
                        <CepInput
                            type="text"
                            placeholder="Digite o CEP"
                            maxLength={8}
                            value={cepInput}
                            onChange={handleCepInputChange}
                        />
                    </CepContainer>
                    {existingAddress && (
                        <>
                            <FormInput
                                type="text"
                                placeholder="Logradouro"
                                value={street}
                                onChange={e => setStreet(e.target.value)}
                            />
                            <FormInput
                                type="text"
                                placeholder="Número"
                                value={streetNumber}
                                onChange={e => setStreetNumber(e.target.value)}
                            />
                            <FormInput
                                type="text"
                                placeholder="Bairro"
                                value={neighborhood}
                                onChange={e => setNeighborhood(e.target.value)}
                            />
                            <FormInput
                                type="text"
                                placeholder="Cidade"
                                value={city}
                                readOnly
                            />
                            <FormInput
                                type="text"
                                placeholder="Estado"
                                value={state}
                                readOnly
                            />
                        </>
                    )}
                    <FormInput
                        type="text"
                        placeholder="Número do WhatsApp"
                        value={whatsapp}
                        onChange={handleWhatsApp}
                        maxLength={15}
                    />
                    <FormTextArea
                        type="text"
                        placeholder="Comentários"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                    <FormButton
                        onClick={() => makeReport()}
                    >Enviar</FormButton>
                </Form>
            </Container>
        </>
    );
};
