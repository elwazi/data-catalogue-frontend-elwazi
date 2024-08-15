import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
import {resolveBrowserLocale} from "ra-core";

const translations = {en, fr};
en.resources = {
    projects: {
        fields: {
            p_accronym: 'Acronym',
            p_description: 'Description',
            p_keywords: 'Keyword(s)',
            p_name: 'Name',
            p_title: 'Title',
            p_website: 'Website',
        }
    },
    datasets: {
        fields: {
            d_category: 'Category',
            d_name: "Name",
            d_status: 'Status',
            d_countries: 'Countries',
            d_type: 'Type',
            data_use_permission: 'Data Use Permissions',
            sample_size: 'Sample Size',
            record_id: 'Project',
            redcap_data_access_group: 'Project'
        }
    }
};

fr.resources ={
    "projects": {
        "name": "Projets",
        "fields": {
            "p_accronym": "Acronyme",
            "p_description": "Description",
            "p_keywords": "Mots-clés",
            "p_name": "Nom",
            "p_title": "Titre",
            "p_website": "Site web",
            "project_metadata_complete": "Métadonnées complètes"
        }
    },
    "datasets": {
        "name": "Ensembles de Données",
        "fields": {
            "d_category": "Catégorie",
            "d_name": "Nom",
            "d_status": "Statut",
            "d_type": "Type",
            "data_use_permission": "Permission d'utilisation des données",
            "sample_size": "Taille de l'échantillon",
            "record_id": "Projet"
        }
    }
}
export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    resolveBrowserLocale('en'),
    [
        {locale: 'en', name: 'English'},
        {locale: 'fr', name: 'Français'}
    ],
    {
        allowMissing: false,
    }
);
