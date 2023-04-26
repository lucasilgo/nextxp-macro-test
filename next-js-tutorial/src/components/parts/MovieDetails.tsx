import { APP_NAME_UNDERSCORED, MetaData, getUrl } from '@enonic/nextjs-adapter';
import { PartProps } from '@enonic/nextjs-adapter/views/BasePart';
import React from 'react';

export const getMovie = `
    query($path:ID!) {
        guillotine {
            get(key:$path) {
                type
                displayName
                parent {
                    _path(type: siteRelative)
                }
                ... on ${APP_NAME_UNDERSCORED}_Movie {
                    data {
                        subtitle
                        abstract
                        trailer
                        release
                        photos {
                            ... on media_Image {
                                imageUrl: imageUrl(type: absolute, scale: "width(500)")
                                attachments {
                                    name
                                }
                            }
                        }
                        cast {
                            character
                            actor {
                                ... on ${APP_NAME_UNDERSCORED}_Person {
                                    _path(type: siteRelative)
                                    displayName
                                    data {
                                        photos {
                                            ... on media_Image {
                                                imageUrl: imageUrl(type: absolute, scale: "block(200, 200)")
                                                attachments {
                                                    name
                                                }
                                            }
                                        }
                                        test {
                                            processedHtml
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const MovieDetails = (props: PartProps) => {
    console.log(props)
    const data = props.data?.get.data as MovieInfoProps;
    const meta = props.meta;
    const { displayName, parent = {} } = props.data.get;
    
    return (
        <>
            <div>
                <h2>{displayName}</h2>
                {data && <MovieInfo {...data} meta={meta} />}
                {data?.cast && <Cast cast={data.cast} meta={meta} />}
            </div>
        </>
    )
};

export default MovieDetails;

const MovieInfo = (props: MovieInfoProps) => {
    const posterPhoto = (props.photos || [])[0] || {};
    return (
        <>
            {props.release && (
                <p>({new Date(props.release).getFullYear()})</p>
            )}
            {posterPhoto.imageUrl && (
                <img src={getUrl(posterPhoto.imageUrl, props.meta)} 
                    title={props.subtitle}
                    alt={props.subtitle}
                />
            )}
            <p>{props.abstract}</p>
        </>
    )
};

const Cast = (props: CastProps) => (
    <div>
        <h4>Cast</h4>
        <ul style={{listStyle: "none", display: "flex", flexFlow: "row wrap"}}>
            {props.cast.map(
                (person:CastMemberProps, i: number) => person && (
                    <CastMember key={i} {...person} meta={props.meta} />
                )
            )}
        </ul>
    </div>
);

const CastMember = (props: CastMemberProps & { meta: MetaData }) => {
    const { character, actor, meta } = props;
    const { displayName, _path, data } = actor;
    const personPhoto = (data.photos || [])[0] || {};

    return (
        <li style={{marginRight: "15px"}}>
            {
                personPhoto.imageUrl &&
                <img src={getUrl(personPhoto.imageUrl, meta)}
                    title={`${displayName} as ${character}`}
                    alt={`${displayName} as ${character}`}
                />
            }
            <div>
                <p>{character}</p>
                <p>
                    <a href={getUrl(_path, meta)}>{displayName}</a>
                </p>
                <div dangerouslySetInnerHTML={{ __html: data.test?.processedHtml }}></div>
            </div>
        </li>
    );
};

interface MovieInfoProps {
    meta: MetaData;
    release: string;
    subtitle: string;
    abstract: string;
    cast: CastMemberProps[],
    photos: {
        imageUrl: string;
    }[];
}

interface CastMemberProps {
    character: string;
    actor: {
        _path: string;
        displayName: string;
        data: {
            photos: {
                imageUrl: string;
                attachments: {
                    name: string
                }[];
            }[];
            test: {
                processedHtml: string;
            }
        }
    }
}

interface CastProps {
    cast: CastMemberProps[];
    meta: MetaData;
}
