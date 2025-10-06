import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Simple ping endpoint
app.get("/make-server-d44bd96a/ping", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Case Studies Management API

// Get all case studies
app.get("/make-server-d44bd96a/casestudies", async (c) => {
  try {
    const caseStudies = await kv.get("case_studies") || [];
    return c.json({ success: true, data: caseStudies });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return c.json({ success: false, error: "Failed to fetch case studies" }, 500);
  }
});

// Create new case study
app.post("/make-server-d44bd96a/casestudies", async (c) => {
  try {
    const body = await c.req.json();
    const caseStudy = {
      ...body,
      id: body.id || `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Get existing case studies
    const existingCases = await kv.get("case_studies") || [];
    const updatedCases = [...existingCases, caseStudy];
    
    // Save to database
    await kv.set("case_studies", updatedCases);
    
    // Also save individual case for faster lookups
    await kv.set(`case_study_${caseStudy.id}`, caseStudy);
    
    console.log(`Created case study: ${caseStudy.id}`);
    return c.json({ success: true, data: caseStudy });
  } catch (error) {
    console.error("Error creating case study:", error);
    return c.json({ success: false, error: "Failed to create case study" }, 500);
  }
});

// Update existing case study
app.put("/make-server-d44bd96a/casestudies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const existingCases = await kv.get("case_studies") || [];
    const caseIndex = existingCases.findIndex((cs: any) => cs.id === id);
    
    if (caseIndex === -1) {
      return c.json({ success: false, error: "Case study not found" }, 404);
    }
    
    const updatedCase = {
      ...existingCases[caseIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    existingCases[caseIndex] = updatedCase;
    
    // Update in database
    await kv.set("case_studies", existingCases);
    await kv.set(`case_study_${id}`, updatedCase);
    
    console.log(`Updated case study: ${id}`);
    return c.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error("Error updating case study:", error);
    return c.json({ success: false, error: "Failed to update case study" }, 500);
  }
});

// Delete case study
app.delete("/make-server-d44bd96a/casestudies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const existingCases = await kv.get("case_studies") || [];
    const filteredCases = existingCases.filter((cs: any) => cs.id !== id);
    
    if (existingCases.length === filteredCases.length) {
      return c.json({ success: false, error: "Case study not found" }, 404);
    }
    
    // Update database
    await kv.set("case_studies", filteredCases);
    await kv.del(`case_study_${id}`);
    
    console.log(`Deleted case study: ${id}`);
    return c.json({ success: true, message: "Case study deleted successfully" });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return c.json({ success: false, error: "Failed to delete case study" }, 500);
  }
});

// Get single case study
app.get("/make-server-d44bd96a/casestudies/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const caseStudy = await kv.get(`case_study_${id}`);
    
    if (!caseStudy) {
      return c.json({ success: false, error: "Case study not found" }, 404);
    }
    
    return c.json({ success: true, data: caseStudy });
  } catch (error) {
    console.error("Error fetching case study:", error);
    return c.json({ success: false, error: "Failed to fetch case study" }, 500);
  }
});

// Bulk update case studies (for admin operations)
app.put("/make-server-d44bd96a/casestudies", async (c) => {
  try {
    const body = await c.req.json();
    const { caseStudies } = body;
    
    if (!Array.isArray(caseStudies)) {
      return c.json({ success: false, error: "Invalid data format" }, 400);
    }
    
    // Update all case studies
    const updatedCases = caseStudies.map((cs: any) => ({
      ...cs,
      updatedAt: new Date().toISOString()
    }));
    
    await kv.set("case_studies", updatedCases);
    
    // Update individual case studies for faster lookups
    for (const caseStudy of updatedCases) {
      await kv.set(`case_study_${caseStudy.id}`, caseStudy);
    }
    
    console.log(`Bulk updated ${updatedCases.length} case studies`);
    return c.json({ success: true, data: updatedCases });
  } catch (error) {
    console.error("Error bulk updating case studies:", error);
    return c.json({ success: false, error: "Failed to bulk update case studies" }, 500);
  }
});

// Get case studies statistics
app.get('/make-server-d44bd96a/case-studies/stats', async (c) => {
  try {
    // Get case studies from KV store
    const caseStudies = await kv.get('case_studies') || [];
    
    if (!Array.isArray(caseStudies)) {
      console.log('Case studies is not an array:', caseStudies);
      return c.json({ 
        success: true, 
        data: {
          totalCases: 0,
          homepageCases: 0,
          categoriesBreakdown: {},
          industriesBreakdown: {},
          lastUpdated: null
        }
      });
    }

    // Count homepage cases
    const homepageCount = caseStudies.filter((cs: any) => cs.showOnHomepage === true).length;

    // Get categories and industries breakdown
    const categoriesBreakdown: Record<string, number> = {};
    const industriesBreakdown: Record<string, number> = {};
    let latestUpdate: string | null = null;
    
    caseStudies.forEach((cs: any) => {
      // Categories
      if (cs.category) {
        categoriesBreakdown[cs.category] = (categoriesBreakdown[cs.category] || 0) + 1;
      }
      
      // Industries
      if (cs.industry) {
        industriesBreakdown[cs.industry] = (industriesBreakdown[cs.industry] || 0) + 1;
      }
      
      // Track latest update
      const updateTime = cs.updatedAt || cs.createdAt;
      if (updateTime && (!latestUpdate || new Date(updateTime) > new Date(latestUpdate))) {
        latestUpdate = updateTime;
      }
    });

    const stats = {
      totalCases: caseStudies.length,
      homepageCases: homepageCount,
      categoriesBreakdown,
      industriesBreakdown,
      lastUpdated: latestUpdate
    };

    console.log('Generated stats:', stats);
    return c.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting case studies stats:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get case studies statistics" 
    }, 500);
  }
});

// Health check endpoint
app.get('/make-server-d44bd96a/health', async (c) => {
  try {
    // Test database connection using KV store
    const testResult = await kv.get('health_check_test');
    
    // Write and read test
    const timestamp = new Date().toISOString();
    await kv.set('health_check_test', { test: true, timestamp });
    const verification = await kv.get('health_check_test');
    
    if (!verification || verification.timestamp !== timestamp) {
      return c.json({ 
        success: false, 
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Database write/read test failed'
      }, 500);
    }

    return c.json({ 
      success: true, 
      status: 'healthy',
      database: 'connected',
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({ 
      success: false, 
      status: 'unhealthy',
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

Deno.serve(app.fetch);