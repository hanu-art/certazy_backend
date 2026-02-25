// src/modules/categories/categories.service.js

import slugify from 'slugify'
import * as queries from './categories.queries.js'
// ── Get all active categories ──────────────────────────────────────────────
const getAllCategories = async () => {
  const [rows] = await queries.getAllCategories()
  return rows
}

// ── Get single category by ID ──────────────────────────────────────────────
const getCategoryById = async (id) => {
  const [rows] = await queries.getCategoryById(id)
  if (!rows.length) {
    const err = new Error('Category not found')
    err.statusCode = 404
    throw err
  }
  return rows[0]
}

// ── Get single category by slug ────────────────────────────────────────────
const getCategoryBySlug = async (slug) => {
  const [rows] = await queries.getCategoryBySlug(slug)
  if (!rows.length) {
    const err = new Error('Category not found')
    err.statusCode = 404
    throw err
  }
  return rows[0]
}

// ── Create new category ────────────────────────────────────────────────────
const createCategory = async ({ name, slug, description, icon, parent_id, sort_order }) => {
  const finalSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(name, { lower: true, strict: true })

  // Check duplicate slug
  const [slugCheck] = await queries.checkSlugExists(finalSlug)
  if (slugCheck.length) {
    const err = new Error('Slug already exists — use a different name or slug')
    err.statusCode = 409
    throw err
  }

  // Validate parent_id if provided
  if (parent_id) {
    const [parentCheck] = await queries.checkParentExists(parent_id)
    if (!parentCheck.length) {
      const err = new Error('Parent category not found or inactive')
      err.statusCode = 400
      throw err
    }
  }

  const [result] = await queries.createCategory({ name, slug: finalSlug, description, icon, parent_id, sort_order })
  const [rows]   = await queries.getCategoryById(result.insertId)
  return rows[0]
}

// ── Update category ────────────────────────────────────────────────────────
const updateCategory = async (id, body) => {
  // Check category exists
  const [existing] = await queries.getCategoryById(id)
  if (!existing.length) {
    const err = new Error('Category not found')
    err.statusCode = 404
    throw err
  }

  const current = existing[0]

  // Merge — jo nahi aaya uski purani value rakh do
  const name       = body.name       ?? current.name
  const slug       = body.slug       ?? current.slug
  const description= body.description?? current.description
  const icon       = body.icon       ?? current.icon
  const parent_id  = body.parent_id  !== undefined ? body.parent_id : current.parent_id
  const is_active  = body.is_active  ?? current.is_active
  const sort_order = body.sort_order ?? current.sort_order

  // If slug changed — check duplicate
  const finalSlug = slugify(slug, { lower: true, strict: true })
  if (finalSlug !== current.slug) {
    const [slugCheck] = await queries.checkSlugExists(finalSlug, id)
    if (slugCheck.length) {
      const err = new Error('Slug already exists — use a different slug')
      err.statusCode = 409
      throw err
    }
  }

  // Validate parent_id if changed
  if (parent_id && parent_id !== current.parent_id) {
    if (parent_id === id) {
      const err = new Error('Category cannot be its own parent')
      err.statusCode = 400
      throw err
    }
    const [parentCheck] = await queries.checkParentExists(parent_id)
    if (!parentCheck.length) {
      const err = new Error('Parent category not found or inactive')
      err.statusCode = 400
      throw err
    }
  }

  await queries.updateCategory(id, { name, slug: finalSlug, description, icon, parent_id, is_active, sort_order })

  const [rows] = await queries.getCategoryById(id)
  return rows[0]
}

// ── Delete category (soft delete) ─────────────────────────────────────────
const deleteCategory = async (id) => {
  // Check category exists
  const [existing] = await queries.getCategoryById(id)
  if (!existing.length) {
    const err = new Error('Category not found')
    err.statusCode = 404
    throw err
  }

  // Block if has active children
  const [children] = await queries.hasChildren(id)
  if (children.length) {
    const err = new Error('Cannot delete — category has active child categories')
    err.statusCode = 400
    throw err
  }

  // Block if has courses
  const [courses] = await queries.hasCourses(id)
  if (courses.length) {
    const err = new Error('Cannot delete — category has courses assigned to it')
    err.statusCode = 400
    throw err
  }

  await queries.deleteCategoryById(id)
}

export { getAllCategories, 
    getCategoryById,
     getCategoryBySlug, 
     createCategory, 
     updateCategory, 
     deleteCategory }