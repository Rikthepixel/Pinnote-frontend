import React, { useState, useRef, useEffect } from 'react'
import { FieldArray } from "formik";
import { Button, FormLabel } from 'react-bootstrap';

const FileInputFieldInternal = props => {

    const filesRef = useRef();
    const [files, setFiles] = useState([]);
    filesRef.current = files;

    const addFiles = (filesToAdd) => {
        filesToAdd = filesToAdd.filter((fileToAdd) => {
            const existingFile = files.find(_existingFile => {
                return fileToAdd.uid == _existingFile.uid;
            });
            return !existingFile;
        })
        setFiles([
            ...filesRef.current,
            ...filesToAdd
        ])
    }
    const removeFile = (uid) => {
        setFiles([
            ...filesRef.current.filter((fileinfo) => fileinfo.uid !== uid)
        ])
    }

    useEffect(() => {
        props.helper.form.setFieldValue(
            props.name,
            files.map((file) => {
                return file.file;
            })
        )
    }, [files])

    return (
        <div className={props.containerClassName}>
            <label htmlFor={props.name} size={props.uploadButtonSize || ""}>
                <Button as="span" className="d-flex gap-2 text-nowrap">
                    {props.uploadIcon && <img
                        className="w-1-0em"
                        src={props.uploadIcon} alt=""
                        style={{ filter: "invert(100%)" }}
                    />}
                    Upload
                </Button>
            </label>
            <input
                className={`w-100 d-none ${props.className || ""}`}
                type="file"
                id={props.name}
                name={props.name}
                accept={props.accept}
                multiple={props.multiple}
                onChange={(e) => {
                    let filesToUpload = [...e.currentTarget.files].map((file) => {
                        return {
                            file: file,
                            uid: `${file.name}${file.size}${file.lastModified}${file.type}`
                        }
                    })

                    if (!props.multiple) {
                        filesToUpload = [
                            filesToUpload[0]
                        ]
                    }


                    addFiles(filesToUpload);
                }}
            />
            <div className="d-flex flex-column gap-1 p-2">
                {files.map((fileInfo) => {
                    const file = fileInfo.file;
                    return (
                        <div
                            className="d-flex justify-content-between align-items-center"
                            key={`${file.name} ${file.size} ${file.lastModified} ${file.size}`}
                        >
                            <div className="text-start">
                                {file.name}
                            </div>
                            <Button
                                variant="danger"
                                onClick={() => removeFile(fileInfo.uid)}
                                size={props.removeButtonSize || ""}
                                className={`${props.removeButtonClassName || ""} text-nowrap`}
                            >
                                Remove
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function FileInputField(props) {
    return (
        <FieldArray
            name={props.name}
            render={(helper) => {
                return (
                    <FileInputFieldInternal
                        {...props}
                        helper={helper}
                        name={props.name || `${Math.random() * 10000} ${Math.random() * 10000} ${Math.random() * 10000}`}
                    />
                )
            }}
        />

    )
}
