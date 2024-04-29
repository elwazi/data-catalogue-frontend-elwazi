import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

const translations = {en, fr};
en['resources'] = {
    projects: {
        fields: {
            p_accronym: 'Acronym',
            p_description: 'Description',
            p_keywords: 'Keywords',
            p_name: 'Name',
            p_title: 'Title',
            p_website: 'Website',
            project_metadata_complete: 'Metadata Complete'
        }
    },
    datasets: {
        fields: {
            d_category: 'Category',
            d_name: "Name",
            d_status: 'Status',
            d_type: 'Type',
            data_use_permission: 'Data Use Permission',
            sample_size: 'Sample Size'
        }
    }
};

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    'en', // default locale
    [
        {locale: 'en', name: 'English'},
        {locale: 'fr', name: 'Français'}
    ],
    {
        allowMissing: true,
    }
);
