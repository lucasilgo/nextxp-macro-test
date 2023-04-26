import React from "react";
import { MacroProps } from "@enonic/nextjs-adapter/views/BaseMacro";
import { getUrl } from "@enonic/nextjs-adapter/UrlProcessor";

interface Quotation {
    text: string
    name: string
    image?: {
        displayName: string
        imageUrl: string
    }
}

function QuotationMacro(props: MacroProps): JSX.Element {
    const quotation = (props.config || {}) as Quotation;

    return <figure className="dsadasdas">
        {
            quotation.image && <img src={getUrl(quotation.image?.imageUrl, props.meta)} alt={quotation.image?.displayName || ''} />
        }
        <div>
            <q>{quotation.text}</q>
            <figcaption>{quotation.name}</figcaption>
        </div>
    </figure>
}

export default QuotationMacro;

export const getQuotationMacroQuery = `{
    text
    name
    image {
        ... on media_Image {
            displayName
            imageUrl(type: absolute, scale:"width(720)")
        }
    }
}`;