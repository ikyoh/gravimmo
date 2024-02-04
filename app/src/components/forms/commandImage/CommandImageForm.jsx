import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_MEDIAS, IRI } from "../../../config/api.config";
import "./style.css";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";

import FilePondPluginFileRename from "filepond-plugin-file-rename";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

// Register the plugins
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileRename,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

export const CommandImageForm = ({ commandID, handleCloseModal }) => {
    const [files, setFiles] = useState([]);
    const queryClient = useQueryClient();

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
            }}
        >
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                allowRevert={false}
                fileRenameFunction={(file) => {
                    return `command-${commandID}${file.extension}`;
                }}
                imageResizeTargetWidth={600}
                maxFiles={10}
                name="file"
                chunkUploads={true}
                labelIdle='Glisser déposer vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
                server={{
                    url: IRI + API_MEDIAS,
                    timeout: 7000,
                    process: {
                        withCredentials: false,
                        onload: (response) => response.key,
                        onerror: (response) => response.data,
                        ondata: (formData) => {
                            formData.append("command", commandID);
                            return formData;
                        },
                    },
                    // revert: './revert',
                    // restore: './restore/',
                    // load: './load/',
                    // fetch: './fetch/',
                }}
                onprocessfiles={() => {
                    queryClient.invalidateQueries();
                }}
            />
        </div>
    );
};
