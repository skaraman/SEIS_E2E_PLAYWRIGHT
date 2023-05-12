import { Page } from '@playwright/test'
import { actions } from '../../helpers'

export const locators = {
	ADMINISTRATION: 'text=Administration',
	MANAGE_USER: 'text="Manage Users"',
	MANAGE_SCHOOL_DISTRICT: 'text="Manage School/District"',
	MANAGE_NEWS_ITEMS: 'text="Manage News Items"',
	MANAGE_DOC_LIBRARY: 'text="Manage Document Library"',
	MANAGE_CUSTOM_FIELDS: 'text="Manage Custom Fields"',
	MANAGE_FORMS: 'text="Release Forms In Use"',
}
